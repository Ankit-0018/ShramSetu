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
    <div className="flex gap-4 justify-center">
      {[...Array(maxLength)].map((_, index) => (
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
          className="w-full h-10 border border-blue-600 bg-white rounded-sm text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}
