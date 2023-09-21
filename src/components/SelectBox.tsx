import { SlArrowRight } from "react-icons/sl";
import styled from "styled-components";

export type SelectBoxProps = {
  label: string;
  options: {
    name: string;
    code: string;
  }[];
  current: string;
  onChange: (curr: string) => void;
};

const StyledSelectBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  border-bottom: solid 1px #ffffff48;
  min-width: 350px;

  .toggler {
    all: unset;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    position: relative;
    padding: 15px 0;

    svg {
      font-size: 0.75rem;
      transform: rotate(0);
      transition: transform 250ms;
    }

    &:hover {
      ul {
        transform: scaleY(1);
      }

      svg {
        transform: rotate(90deg);
      }
    }
  }

  ul {
    list-style: none;
    margin: unset;
    padding: unset;
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1;
    background-color: ${({ theme }) => theme.colors.option.background};
    min-width: 100px;
    border-radius: 0 0 5px 5px;
    padding: 0;
    transform-origin: top center;
    transform: scaleY(0);
    transition: transform 250ms;

    li {
      padding: 2px 0;
      background-color: transparent;
      transition: background-color 250ms;

      &:hover {
        background-color: #ffffff1b;
      }

      &:not(:last-of-type) {
        border-bottom: solid 2px ${({ theme }) => theme.colors.background};
      }

      div {
        text-align: center;
      }
    }
  }
`;

function SelectBox({ current, label, options, onChange }: SelectBoxProps) {
  return (
    <StyledSelectBox>
      <span>{label}</span>
      <button className="toggler" type="button">
        <span>{current}</span>
        <SlArrowRight />
        <ul>
          {options.map((option, i) =>
            option.name === current ? null : (
              <li key={i}>
                <div onClick={() => onChange(option.code)}>{option.name}</div>
              </li>
            )
          )}
        </ul>
      </button>
    </StyledSelectBox>
  );
}

export default SelectBox;
