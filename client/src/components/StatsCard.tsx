import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';
import { NumberTicker } from './magicui/number-ticker';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  colorClass?: string; // Optional: allow color accent
}

export function StatsCard({ title, value, icon, className, colorClass }: StatsCardProps) {
  const isNumber = typeof value === 'number';
  return (
    <Card
      className={cn(
        'group relative overflow-hidden border border-muted/20 bg-card hover:bg-card/80 transition-colors duration-200 shadow-sm',
        'rounded-xl p-0',
        className
      )}
    >
      {/* Decorative background blob */}
      <div className={cn(
        'absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none',
        colorClass || 'bg-primary'
      )} />
      <CardContent className="flex flex-col gap-2 p-5 sm:p-6 min-h-[110px] justify-between">
        <div className="flex items-center justify-between pb-1">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground truncate max-w-[70%]">{title}</div>
          {icon && (
            <div className="text-muted-foreground flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end gap-2 mt-2 font-outfit">
          {isNumber ? (
            <NumberTicker value={value as number} className="text-3xl sm:text-4xl font-extrabold text-foreground drop-shadow-sm" />
          ) : (
            <span className="text-2xl sm:text-3xl font-bold text-foreground break-all">{value}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
