'use client';

import { useEffect, useRef, useState } from 'react';
import { Gauge, Route, Search, ShieldCheck, UserCheck, Workflow, Wrench } from 'lucide-react';
import type { AgentId } from '@/lib/agents';
import { cn } from '@/lib/utils';
import Scramble from './Scramble';
import { b, Kinetic } from './ui';

type Node = {
  id: string;
  label: string;
  note: string;
  /** Position inside the stage, in percent. */
  x: number;
  y: number;
  icon: typeof Route;
  agent?: AgentId;
};

const hub = { x: 50, y: 50 };

/** The specialists around the orchestrator. Colours reuse the build crew's. */
const nodes: Node[] = [
  {
    id: 'planner',
    label: 'Planner',
    note: 'breaks the request down',
    x: 17,
    y: 28,
    icon: Route,
    agent: 'planner',
  },
  {
    id: 'retriever',
    label: 'Retriever',
    note: 'RAG · vector search',
    x: 50,
    y: 11,
    icon: Search,
    agent: 'designer',
  },
  {
    id: 'tools',
    label: 'Tool caller',
    note: 'MCP tools · APIs',
    x: 83,
    y: 28,
    icon: Wrench,
    agent: 'builder',
  },
  {
    id: 'evaluator',
    label: 'Evaluator',
    note: 'LLM evals · tracing',
    x: 83,
    y: 72,
    icon: Gauge,
    agent: 'qa',
  },
  {
    id: 'guardrails',
    label: 'Guardrails',
    note: 'injection checks · masking',
    x: 50,
    y: 89,
    icon: ShieldCheck,
    agent: 'deployer',
  },
  {
    id: 'human',
    label: 'Human gate',
    note: 'approval before it ships',
    x: 17,
    y: 72,
    icon: UserCheck,
  },
];

/** One simulated run, step by step. */
const script = [
  { node: 'planner', text: 'plan the run', result: '4 steps' },
  { node: 'retriever', text: 'retrieve policy context', result: '6 chunks' },
  { node: 'tools', text: 'call tools over MCP', result: '3 calls' },
  { node: 'evaluator', text: 'score 24 quality parameters', result: '24 / 24' },
  { node: 'guardrails', text: 'mask PII, check for injection', result: 'clean' },
  { node: 'human', text: 'approval gate', result: 'approved' },
];

type Line = { step: number; done: boolean };

const finishedRun: Line[] = script.map((_, step) => ({ step, done: true }));
const nodeById = (id: string) => nodes.find((node) => node.id === id) ?? nodes[0];
const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * An animated picture of how an agent run flows: the orchestrator hands work to
 * one specialist at a time, a packet travels out and back, and the trace on the
 * right logs each step. It is a simulation that loops while it is on screen.
 *
 * Without JavaScript, or with reduced motion, it shows a finished run.
 */
export default function AgentLoop() {
  const stageRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Line[]>(finishedRun);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const packet = packetRef.current;
    if (!stage || !packet) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let visible = false;

    // Send the packet between two points given in percent of the stage.
    const fly = (from: { x: number; y: number }, to: { x: number; y: number }, ms: number) => {
      const { width, height } = stage.getBoundingClientRect();
      const at = (p: { x: number; y: number }) =>
        `translate3d(${(p.x / 100) * width}px, ${(p.y / 100) * height}px, 0)`;
      return packet
        .animate(
          [
            { transform: at(from), opacity: 1 },
            { transform: at(to), opacity: 1 },
          ],
          { duration: ms, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }
        )
        .finished.catch(() => undefined);
    };

    const loop = async () => {
      while (!cancelled) {
        if (!visible || document.hidden) {
          await sleep(400);
          continue;
        }
        setLines([]);
        setActive(null);
        await sleep(600);

        for (let step = 0; step < script.length && !cancelled; step += 1) {
          const node = nodeById(script[step].node);
          packet.setAttribute('data-agent', node.agent ?? '');
          setActive(node.id);
          setLines((current) => [...current, { step, done: false }]);
          await fly(hub, node, 520);
          await sleep(440);
          await fly(node, hub, 420);
          setLines((current) =>
            current.map((line) => (line.step === step ? { ...line, done: true } : line))
          );
          await sleep(140);
        }

        setActive(null);
        await sleep(2800);
      }
    };
    loop();

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.25 }
    );
    observer.observe(stage);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const running = lines.find((line) => !line.done);
  const finished = lines.length === script.length && !running;

  return (
    <section id="loop" className="section pt-0" data-glow="cyan">
      <div className="wrap">
        <header {...b('loop/heading')} className="mb-12 max-w-3xl sm:mb-16">
          <p className="frame-label">
            <Scramble text="Agent loop" />
          </p>
          <h2 className="h2 mt-5">
            <Kinetic text="How an agent run *actually flows.*" />
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft">
            The pattern behind most of what I build: an orchestrator plans, specialists act through
            tools, and nothing reaches production until evaluators, guardrails and a human have
            signed off.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Graph */}
          <div {...b('loop/graph')} className="card p-3 sm:p-6 lg:col-span-7">
            <div ref={stageRef} className="loop-stage">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {nodes.map((node) => (
                  <line
                    key={node.id}
                    x1={hub.x}
                    y1={hub.y}
                    x2={node.x}
                    y2={node.y}
                    data-agent={node.agent}
                    className={cn('loop-edge', active === node.id && 'is-active')}
                  />
                ))}
              </svg>

              <span ref={packetRef} className="loop-packet" aria-hidden="true" />

              <div
                className={cn('loop-node loop-node--hub', active && 'is-active')}
                style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
              >
                <Workflow className="size-5 shrink-0" />
                <span>
                  <span className="block text-sm font-semibold">Orchestrator</span>
                  <span className="loop-node__note">A2A message bus</span>
                </span>
              </div>

              {nodes.map((node) => (
                <div
                  key={node.id}
                  data-agent={node.agent}
                  className={cn('loop-node', active === node.id && 'is-active')}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <node.icon className="size-4 shrink-0 text-agent" />
                  <span>
                    <span className="block text-[13px] font-semibold">{node.label}</span>
                    <span className="loop-node__note">{node.note}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trace */}
          <div
            {...b('loop/trace', 1)}
            className="card flex flex-col overflow-hidden font-mono text-xs lg:col-span-5"
          >
            <div className="flex h-11 items-center gap-2 border-b border-line px-4">
              <span className="size-2.5 rounded-full bg-pink" />
              <span className="size-2.5 rounded-full bg-amber" />
              <span className="size-2.5 rounded-full bg-green" />
              <span className="ml-2 text-ink">agent-trace</span>
              <span className="tag ml-auto">simulated run</span>
            </div>

            <div className="flex-1 p-4 sm:p-5">
              <p className="text-ink-faint">
                <span className="text-select">$</span> run --task{' '}
                <span className="text-ink">&quot;score this support call&quot;</span>
              </p>
              <ol className="mt-4 min-h-[13.5rem] space-y-2.5">
                {lines.map(({ step, done }) => {
                  const node = nodeById(script[step].node);
                  return (
                    <li
                      key={step}
                      data-agent={node.agent}
                      className="flex animate-[rise-in_0.35s_var(--ease-out-quint)_both] items-baseline gap-2.5"
                    >
                      <span className="w-3 shrink-0 text-agent">{done ? '✓' : '›'}</span>
                      <span className="w-[4.75rem] shrink-0 text-agent">{node.id}</span>
                      <span className="min-w-0 flex-1 text-ink-soft">{script[step].text}</span>
                      <span className={cn('shrink-0', done ? 'text-ink' : 'text-ink-faint')}>
                        {done ? script[step].result : '…'}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="flex h-11 items-center gap-2.5 border-t border-line px-4 text-ink-soft">
              <span className={cn('pulse', finished && 'after:hidden')} />
              {finished
                ? `shipped · ${script.length} steps · human approved`
                : running
                  ? `step ${running.step + 1} of ${script.length} · ${script[running.step].node}`
                  : 'waiting for a request'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
