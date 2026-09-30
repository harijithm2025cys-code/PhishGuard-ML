import React from 'react';
import { 
  FileText, Globe, FolderTree, Dot, Minus, Slash, 
  Hash, Sparkles, Layers, ShieldCheck, ShieldAlert, AtSign, 
  Server, HelpCircle 
} from 'lucide-react';

export default function FeaturePanel({ features }) {
  if (!features) return null;

  const featureCards = [
    {
      label: 'URL Length',
      value: features.url_length ?? 0,
      icon: FileText,
      highlight: (features.url_length ?? 0) > 75,
      note: (features.url_length ?? 0) > 75 ? 'Long URL' : 'Normal',
    },
    {
      label: 'Domain Length',
      value: features.domain_length ?? 0,
      icon: Globe,
      highlight: (features.domain_length ?? 0) > 30,
      note: 'Host chars',
    },
    {
      label: 'Path Length',
      value: features.path_length ?? 0,
      icon: FolderTree,
      highlight: false,
      note: 'Resource path',
    },
    {
      label: 'Dot Count',
      value: features.dot_count ?? 0,
      icon: Dot,
      highlight: (features.dot_count ?? 0) >= 4,
      note: 'Dots in string',
    },
    {
      label: 'Hyphens',
      value: features.hyphen_count ?? 0,
      icon: Minus,
      highlight: (features.hyphen_count ?? 0) >= 3,
      note: 'Dashes count',
    },
    {
      label: 'Slashes',
      value: features.slash_count ?? 0,
      icon: Slash,
      highlight: false,
      note: 'Path delimiters',
    },
    {
      label: 'Digits',
      value: features.digit_count ?? 0,
      icon: Hash,
      highlight: (features.digit_count ?? 0) > 8,
      note: 'Numeric chars',
    },
    {
      label: 'Special Chars',
      value: features.special_character_count ?? 0,
      icon: Sparkles,
      highlight: (features.special_character_count ?? 0) >= 5,
      note: 'Symbols & punctuation',
    },
    {
      label: 'Subdomains',
      value: features.subdomain_count ?? 0,
      icon: Layers,
      highlight: (features.subdomain_count ?? 0) >= 2,
      note: 'Domain levels',
    },
    {
      label: 'HTTPS Scheme',
      value: features.has_https ? 'YES' : 'NO',
      icon: features.has_https ? ShieldCheck : ShieldAlert,
      highlight: !features.has_https,
      isBoolean: true,
      booleanGood: features.has_https,
      note: features.has_https ? 'Encrypted' : 'Unencrypted HTTP',
    },
    {
      label: 'IP Address Host',
      value: features.has_ip_address ? 'YES' : 'NO',
      icon: Server,
      highlight: features.has_ip_address,
      isBoolean: true,
      booleanGood: !features.has_ip_address,
      note: features.has_ip_address ? 'Raw IPv4 detected' : 'Standard hostname',
    },
    {
      label: '@ Symbol',
      value: features.has_at_symbol ? 'YES' : 'NO',
      icon: AtSign,
      highlight: features.has_at_symbol,
      isBoolean: true,
      booleanGood: !features.has_at_symbol,
      note: features.has_at_symbol ? 'Present' : 'Absent',
    },
    {
      label: 'Non-Standard Port',
      value: features.has_port ? 'YES' : 'NO',
      icon: Server,
      highlight: features.has_port,
      isBoolean: true,
      booleanGood: !features.has_port,
      note: features.has_port ? 'Custom Port' : 'Default (80/443)',
    },
    {
      label: 'Query Parameters',
      value: features.query_parameter_count ?? 0,
      icon: HelpCircle,
      highlight: (features.query_parameter_count ?? 0) >= 4,
      note: 'URL parameters',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>URL Characteristics</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
              Lexical Features
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Static structural metrics extracted directly from the URL string
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 sm:gap-3 gap-2">
        {featureCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 glass-card ${
                card.highlight
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-slate-800/80 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-400">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${
                  card.isBoolean 
                    ? card.booleanGood ? 'text-emerald-400' : 'text-rose-400'
                    : card.highlight ? 'text-amber-400' : 'text-cyan-400/80'
                }`} />
              </div>

              <div className="flex items-baseline justify-between">
                <span className={`text-lg sm:text-xl font-bold font-mono ${
                  card.isBoolean
                    ? card.booleanGood ? 'text-emerald-300' : 'text-rose-400'
                    : card.highlight ? 'text-amber-300' : 'text-slate-100'
                }`}>
                  {card.value}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {card.note}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
