import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { SelectOption, SelectProps } from "./types";

import styles from "./styles.module.css";

export const Select = ({ multiple, value, options, onChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hightlightedIndex, setHightlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearOptions = () => {
    return multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((opt) => opt !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option === value;
  };

  useEffect(() => {
    if (isOpen) setHightlightedIndex(0);
  }, [isOpen]);

  const divOnBlur = () => setIsOpen(false);
  const divOnClick = () => setIsOpen((prev) => !prev);

  const validate = (code: string) => {
    switch (code) {
      case "Enter":
      case "Space":
        setIsOpen((prev) => !prev);
        if (isOpen) selectOption(options[hightlightedIndex]);

        break;
      case "ArrowUp":
      case "ArrowDown": {
        if (!isOpen) {
          setIsOpen(true);
          break;
        }

        const newValue = hightlightedIndex + (code === "ArrowDown" ? 1 : -1);
        if (newValue >= 0 && newValue < options.length) {
          setHightlightedIndex(newValue);
        }
        break;
      }
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.target != containerRef.current) return;

      validate(ev.code);
    };

    containerRef.current?.addEventListener(
      "keydown",
      handler as unknown as EventListener
    );

    return () => {
      containerRef.current?.removeEventListener(
        "keydown",
        handler as unknown as EventListener
      );
    };
  }, [isOpen, hightlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={divOnBlur}
      onClick={divOnClick}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((val) => (
              <button
                key={val.value}
                onClick={(ev) => {
                  ev.stopPropagation();
                  selectOption(val);
                }}
                className={styles["option-badge"]}
              >
                {val.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>

      <button
        className={styles["clear-btn"]}
        onClick={(ev) => {
          ev.stopPropagation();
          clearOptions();
        }}
      >
        &times;
      </button>

      <div className={styles.divider}></div>

      <div className={styles.caret}></div>

      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            key={`${option.value}`}
            onClick={(ev) => {
              ev.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHightlightedIndex(index)}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${index === hightlightedIndex ? styles.hightlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
