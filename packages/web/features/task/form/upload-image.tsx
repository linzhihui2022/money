import type { InputProps } from "@/components/ui/input";
import { ImagePlusIcon } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/use-toast";
export const UploadInput = ({
  name,
  onChange: _onChange,
  onUpload,
  ...props
}: Omit<InputProps, "type" | "name"> & {
  name: string;
  onUpload: (file: File) => void;
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    _onChange?.(e);
    if (!file) return;
    try {
      onUpload(file);
    } catch (error) {
      const e = error as Error;
      toast({ title: "Error", description: e.message, variant: "destructive" });
      if (ref.current) {
        ref.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        id={name}
        type="file"
        ref={ref}
        className="hidden peer"
        name={name}
        onChange={onChange}
        {...props}
      />
      <Label
        htmlFor={name}
        className="cursor-pointer w-16 h-16 flex items-center justify-center rounded border border-dashed relative"
      >
        <ImagePlusIcon className="size-5 text-muted-foreground" />
      </Label>
    </div>
  );
};
