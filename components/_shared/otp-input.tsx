export function CustomOTPInput({
  value,
  onChange,
  maxLength = 6,
}: {
  value: string;
  onChange: (value: string, change: string) => void;
  maxLength?: number;
}) {
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, maxLength);
    onChange("otp", pastedData);

    const nextIndex = Math.min(pastedData.length - 1, maxLength - 1);
    setTimeout(() => {
      const nextInput = document.getElementById(`otp-${nextIndex}`);
      nextInput?.focus();
    }, 0);
  };

  const handleChange = (index: number, digit: string) => {
    if (!/^\d?$/.test(digit)) return;

    const arr = value.split("");
    arr[index] = digit;
    onChange("otp",arr.join(""));

    // move forward
    if (digit && index < maxLength - 1) {
      requestAnimationFrame(() => {
        document.getElementById(`otp-${index + 1}`)?.focus();
      });
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const arr = value.split("");

      if (arr[index]) {
        // clear current digit
        arr[index] = "";
        onChange("otp",arr.join(""));
      } else if (index > 0) {
        // move backward
        requestAnimationFrame(() => {
          document.getElementById(`otp-${index - 1}`)?.focus();
        });
      }
    }
  };

  return (
    <div className="flex justify-center gap-2.5">
      {[...Array(maxLength)].map((_, index) => {
        const filled = Boolean(value[index]);
        return (
          <input
            key={index}
            id={`otp-${index}`}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) =>
              handleChange(index, e.target.value.replace(/\D/g, ""))
            }
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`h-14 w-11 rounded-2xl border-2 bg-secondary text-center text-2xl font-bold outline-none transition-colors focus:border-primary focus:bg-background ${
              filled ? "border-primary bg-success-muted" : "border-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}
