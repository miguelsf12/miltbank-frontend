import { useRef } from "react";

function InputCurrency({ className, value, handleOnChange, disabled, currencySymbol }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  };

  return (
    <div>
      <input
        className={className}
        type="text"
        name="amount"
        value={`${currencySymbol} ${value}`}
        onChange={handleOnChange}
        placeholder="R$ 0,00"
        ref={inputRef}
        onClick={handleClick}
        disabled={disabled}
      />
    </div>
  );
}

export default InputCurrency;
