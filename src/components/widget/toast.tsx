import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ToastOptions {
  title: string;
  description: string;
  actionLabel: string;
  onActionClick: () => void;
}

export function useCustomToast() {
  const { toast } = useToast();

  const showToast = ({
    title,
    description,
    actionLabel,
    onActionClick,
  }: ToastOptions) => {
    toast({
      title,
      description,
      action: (
        <ToastAction altText={actionLabel} onClick={onActionClick}>
          {actionLabel}
        </ToastAction>
      ),
    });
  };

  return showToast;
}
