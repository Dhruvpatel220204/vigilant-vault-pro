import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';

interface TrustScoreCardProps {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

export default function TrustScoreCard({ score, level }: TrustScoreCardProps) {
  const config = {
    low: { label: 'Low Risk', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: ShieldCheck, gradient: 'from-success to-success/60' },
    medium: { label: 'Medium Risk', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: Shield, gradient: 'from-warning to-warning/60' },
    high: { label: 'High Risk', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20', icon: ShieldAlert, gradient: 'from-destructive to-destructive/60' },
    critical: { label: 'Critical Risk', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20', icon: ShieldX, gradient: 'from-destructive to-red-400' },
  };

  const c = config[level];
  const Icon = c.icon;
  const circumference = 2 * Math.PI * 58;
  const progress = ((100 - score) / 100) * circumference;

  return (
    <div className={`glass-card p-6 ${c.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trust Score</h3>
        <span className={`text-xs font-mono px-2 py-1 rounded-full ${c.bg} ${c.color}`}>{c.label}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/50" />
            <motion.circle
              cx="64" cy="64" r="58"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progress }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={c.color} style={{ stopColor: 'currentColor' }} />
                <stop offset="100%" style={{ stopColor: 'hsl(200, 80%, 50%)' }} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}
            </motion.span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${c.color}`} />
            <span className="text-foreground font-medium">Security Status</span>
          </div>
          <div className="space-y-2">
            <ScoreBar label="Device Trust" value={score > 70 ? 90 : score > 40 ? 60 : 30} />
            <ScoreBar label="Login Pattern" value={score > 60 ? 85 : score > 30 ? 50 : 20} />
            <ScoreBar label="Location Match" value={score > 50 ? 95 : 40} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value > 70 ? 'bg-success' : value > 40 ? 'bg-warning' : 'bg-destructive';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-mono">{value}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
  );
}
