import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type PlayerId = "p1" | "p2";

type Player = {
  id: PlayerId;
  x: number;
  y: number;
  health: number;
  alive: boolean;
  facing: { x: number; y: number };
  respawnAt: number;
  shieldUntil: number;
};

type Base = {
  id: PlayerId;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
};

type Bullet = {
  id: number;
  owner: PlayerId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

type Obstacle = { x: number; y: number; width: number; height: number };

type GameState = {
  players: Record<PlayerId, Player>;
  bases: Record<PlayerId, Base>;
  bullets: Bullet[];
  winner: PlayerId | null;
  lastUpdate: number;
};

const ARENA_WIDTH = 1200;
const ARENA_HEIGHT = 700;
const PLAYER_RADIUS = 18;
const PLAYER_MAX_HP = 100;
const BASE_MAX_HP = 450;
const BULLET_SPEED = 380;
const BULLET_DAMAGE_PLAYER = 20;
const BULLET_DAMAGE_BASE = 8;
const PLAYER_SPEED = 230;
const FIRE_COOLDOWN = 280;

const OBSTACLES: Obstacle[] = [
  { x: 510, y: 80, width: 180, height: 60 },
  { x: 510, y: 560, width: 180, height: 60 },
  { x: 420, y: 250, width: 90, height: 200 },
  { x: 690, y: 250, width: 90, height: 200 },
  { x: 560, y: 300, width: 80, height: 100 },
];

const BASES: Record<PlayerId, Omit<Base, "health">> = {
  p1: { id: "p1", x: 30, y: 260, width: 100, height: 180 },
  p2: { id: "p2", x: 1070, y: 260, width: 100, height: 180 },
};

const spawns: Record<PlayerId, { x: number; y: number }> = {
  p1: { x: 190, y: 350 },
  p2: { x: 1010, y: 350 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const circleIntersectsRect = (
  cx: number,
  cy: number,
  radius: number,
  rect: { x: number; y: number; width: number; height: number }
) => {
  const closestX = clamp(cx, rect.x, rect.x + rect.width);
  const closestY = clamp(cy, rect.y, rect.y + rect.height);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < radius * radius;
};

const makeInitialState = (): GameState => ({
  players: {
    p1: {
      id: "p1",
      ...spawns.p1,
      health: PLAYER_MAX_HP,
      alive: true,
      facing: { x: 1, y: 0 },
      respawnAt: 0,
      shieldUntil: 0,
    },
    p2: {
      id: "p2",
      ...spawns.p2,
      health: PLAYER_MAX_HP,
      alive: true,
      facing: { x: -1, y: 0 },
      respawnAt: 0,
      shieldUntil: 0,
    },
  },
  bases: {
    p1: { ...BASES.p1, health: BASE_MAX_HP },
    p2: { ...BASES.p2, health: BASE_MAX_HP },
  },
  bullets: [],
  winner: null,
  lastUpdate: performance.now(),
});

const normalize = (x: number, y: number) => {
  const length = Math.hypot(x, y);
  if (!length) return { x: 0, y: 0 };
  return { x: x / length, y: y / length };
};

const Index = () => {
  const [game, setGame] = useState<GameState>(() => makeInitialState());
  const keysRef = useRef(new Set<string>());
  const bulletId = useRef(0);
  const lastShot = useRef<Record<PlayerId, number>>({ p1: 0, p2: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);

  const controls = useMemo(
    () => ({
      p1: {
        up: "KeyW",
        down: "KeyS",
        left: "KeyA",
        right: "KeyD",
        shoot: ["Space"],
      },
      p2: {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        shoot: ["ControlRight", "ControlLeft", "Control"],
      },
    }),
    []
  );

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current.add(e.code);
      if (e.key === "Control") keysRef.current.add("Control");
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
      if (e.key === "Control") keysRef.current.delete("Control");
    };
    const clear = () => keysRef.current.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clear);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useEffect(() => {
    let raf = 0;

    const step = () => {
      setGame((prev) => {
        const now = performance.now();
        const dt = Math.min((now - prev.lastUpdate) / 1000, 0.032);
        if (dt <= 0) return prev;

        const next: GameState = {
          ...prev,
          players: {
            p1: { ...prev.players.p1 },
            p2: { ...prev.players.p2 },
          },
          bases: {
            p1: { ...prev.bases.p1 },
            p2: { ...prev.bases.p2 },
          },
          bullets: [...prev.bullets],
          lastUpdate: now,
        };

        (Object.keys(next.players) as PlayerId[]).forEach((id) => {
          const player = next.players[id];
          if (!player.alive && now >= player.respawnAt) {
            player.alive = true;
            player.health = PLAYER_MAX_HP;
            player.x = spawns[id].x;
            player.y = spawns[id].y;
            player.shieldUntil = now + 2000;
          }
        });

        if (!next.winner) {
          (Object.keys(next.players) as PlayerId[]).forEach((id) => {
            const player = next.players[id];
            if (!player.alive) return;

            const c = controls[id];
            const dirX = (keysRef.current.has(c.right) ? 1 : 0) - (keysRef.current.has(c.left) ? 1 : 0);
            const dirY = (keysRef.current.has(c.down) ? 1 : 0) - (keysRef.current.has(c.up) ? 1 : 0);
            const dir = normalize(dirX, dirY);

            if (dir.x !== 0 || dir.y !== 0) {
              player.facing = dir;
            }

            const moveX = dir.x * PLAYER_SPEED * dt;
            const moveY = dir.y * PLAYER_SPEED * dt;

            const attemptMove = (nx: number, ny: number) => {
              const inBounds =
                nx - PLAYER_RADIUS >= 0 &&
                nx + PLAYER_RADIUS <= ARENA_WIDTH &&
                ny - PLAYER_RADIUS >= 0 &&
                ny + PLAYER_RADIUS <= ARENA_HEIGHT;
              if (!inBounds) return false;

              const blockedByObstacle = OBSTACLES.some((o) => circleIntersectsRect(nx, ny, PLAYER_RADIUS, o));
              const blockedByBase = (Object.values(next.bases) as Base[]).some((b) =>
                circleIntersectsRect(nx, ny, PLAYER_RADIUS, b)
              );
              return !blockedByObstacle && !blockedByBase;
            };

            const nx = player.x + moveX;
            const ny = player.y + moveY;
            if (attemptMove(nx, player.y)) player.x = nx;
            if (attemptMove(player.x, ny)) player.y = ny;

            const wantsToShoot = c.shoot.some((code) => keysRef.current.has(code));
            if (wantsToShoot && now - lastShot.current[id] >= FIRE_COOLDOWN) {
              const face =
                player.facing.x === 0 && player.facing.y === 0
                  ? id === "p1"
                    ? { x: 1, y: 0 }
                    : { x: -1, y: 0 }
                  : player.facing;

              next.bullets.push({
                id: bulletId.current++,
                owner: id,
                x: player.x + face.x * (PLAYER_RADIUS + 8),
                y: player.y + face.y * (PLAYER_RADIUS + 8),
                vx: face.x * BULLET_SPEED,
                vy: face.y * BULLET_SPEED,
                radius: 5,
              });
              lastShot.current[id] = now;
            }
          });
        }

        next.bullets = next.bullets.filter((b) => {
          const x = b.x + b.vx * dt;
          const y = b.y + b.vy * dt;
          b.x = x;
          b.y = y;

          const inBounds = x > -10 && y > -10 && x < ARENA_WIDTH + 10 && y < ARENA_HEIGHT + 10;
          if (!inBounds) return false;

          if (OBSTACLES.some((o) => circleIntersectsRect(x, y, b.radius, o))) return false;

          const enemyId: PlayerId = b.owner === "p1" ? "p2" : "p1";
          const enemyPlayer = next.players[enemyId];
          if (enemyPlayer.alive) {
            const hitPlayer = Math.hypot(x - enemyPlayer.x, y - enemyPlayer.y) < PLAYER_RADIUS + b.radius;
            const hasShield = now < enemyPlayer.shieldUntil;
            if (hitPlayer) {
              if (!hasShield) {
                enemyPlayer.health = Math.max(0, enemyPlayer.health - BULLET_DAMAGE_PLAYER);
                if (enemyPlayer.health <= 0) {
                  enemyPlayer.alive = false;
                  enemyPlayer.respawnAt = now + (1000 + Math.random() * 2000);
                }
              }
              return false;
            }
          }

          const enemyBase = next.bases[enemyId];
          if (circleIntersectsRect(x, y, b.radius, enemyBase)) {
            enemyBase.health = Math.max(0, enemyBase.health - BULLET_DAMAGE_BASE);
            if (enemyBase.health <= 0 && !next.winner) {
              next.winner = b.owner;
            }
            return false;
          }

          return true;
        });

        return next;
      });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [controls]);

  const restart = () => {
    lastShot.current = { p1: 0, p2: 0 };
    bulletId.current = 0;
    keysRef.current.clear();
    setGame(makeInitialState());
    rootRef.current?.focus();
  };

  const p1Shield = game.players.p1.alive && performance.now() < game.players.p1.shieldUntil;
  const p2Shield = game.players.p2.alive && performance.now() < game.players.p2.shieldUntil;

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <header className="rounded-xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur-sm">
          <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">Arena Base Duel</h1>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-muted/50 p-3">
              <p className="text-sm font-semibold text-foreground">Player 1 (WASD + Space)</p>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-player-one" style={{ width: `${game.players.p1.health}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Base HP: {Math.ceil(game.bases.p1.health)}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/50 p-3">
              <p className="text-sm font-semibold text-foreground">Player 2 (Arrows + Right Ctrl)</p>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-player-two" style={{ width: `${game.players.p2.health}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Base HP: {Math.ceil(game.bases.p2.health)}</p>
            </div>
          </div>
        </header>

        <div
          ref={rootRef}
          tabIndex={0}
          className="arena-shell relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Top down two player arena"
          onClick={() => rootRef.current?.focus()}
        >
          <svg viewBox={`0 0 ${ARENA_WIDTH} ${ARENA_HEIGHT}`} className="h-[68vh] min-h-[420px] w-full" role="img">
            <title>Two player arena with bases, bullets, and obstacles</title>
            <rect x="0" y="0" width={ARENA_WIDTH} height={ARENA_HEIGHT} className="fill-arena-floor" />

            {(Object.values(game.bases) as Base[]).map((base) => (
              <g key={base.id}>
                <rect
                  x={base.x}
                  y={base.y}
                  width={base.width}
                  height={base.height}
                  rx={16}
                  className={base.id === "p1" ? "fill-player-one-soft stroke-player-one" : "fill-player-two-soft stroke-player-two"}
                  strokeWidth={4}
                />
                <rect x={base.x + 8} y={base.y - 18} width={base.width - 16} height={8} rx={4} className="fill-secondary" />
                <rect
                  x={base.x + 8}
                  y={base.y - 18}
                  width={(base.width - 16) * (base.health / BASE_MAX_HP)}
                  height={8}
                  rx={4}
                  className={base.id === "p1" ? "fill-player-one" : "fill-player-two"}
                />
              </g>
            ))}

            {OBSTACLES.map((o, i) => (
              <rect
                key={i}
                x={o.x}
                y={o.y}
                width={o.width}
                height={o.height}
                rx={12}
                className="fill-obstacle stroke-obstacle-edge"
                strokeWidth={3}
              />
            ))}

            {game.bullets.map((b) => (
              <circle key={b.id} cx={b.x} cy={b.y} r={b.radius} className={b.owner === "p1" ? "fill-player-one" : "fill-player-two"} />
            ))}

            {(Object.values(game.players) as Player[]).map((player) => {
              if (!player.alive) return null;
              const shield = player.id === "p1" ? p1Shield : p2Shield;
              return (
                <g key={player.id} className={shield ? "shield-glow" : ""}>
                  {shield && (
                    <circle
                      cx={player.x}
                      cy={player.y}
                      r={PLAYER_RADIUS + 8}
                      className={player.id === "p1" ? "fill-player-one-shield" : "fill-player-two-shield"}
                    />
                  )}
                  <circle
                    cx={player.x}
                    cy={player.y}
                    r={PLAYER_RADIUS}
                    className={player.id === "p1" ? "fill-player-one" : "fill-player-two"}
                  />
                  <line
                    x1={player.x}
                    y1={player.y}
                    x2={player.x + player.facing.x * (PLAYER_RADIUS + 12)}
                    y2={player.y + player.facing.y * (PLAYER_RADIUS + 12)}
                    className="stroke-foreground"
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {game.winner && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-2xl animate-enter">
                <p className="text-3xl font-bold text-foreground">{game.winner === "p1" ? "Player 1 Wins" : "Player 2 Wins"}</p>
                <p className="mt-2 text-sm text-muted-foreground">Base destroyed. Hit restart for a rematch.</p>
                <Button onClick={restart} className="mt-4 gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Restart Match
                </Button>
              </div>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between rounded-xl border border-border bg-card/70 p-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Respawn has 1–3s delay + 2s invulnerability shield.
          </p>
          <Button variant="outline" onClick={restart} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Restart
          </Button>
        </footer>
      </div>
    </main>
  );
};

export default Index;
