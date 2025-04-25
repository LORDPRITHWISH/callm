
import { cn } from "@/lib/utils";

interface FeatureIconProps {
  className?: string;
  gradient: string;
}

export const FeatureIcon = ({ className, gradient }: FeatureIconProps) => {
  return (
    <div 
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        "transform transition-transform duration-300 hover:scale-110",
        className
      )}
      style={{
        background: gradient,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}
    />
  );
};