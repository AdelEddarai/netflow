import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { MdFormatQuote } from "react-icons/md";
import "./style.css";

// The types of quotes that users can choose from.
export const quoteTypes = [
  {
    title: "Motivational",
    value: "motivational",
    icon: MdFormatQuote,
    color: "#007BFF",
    backgroundColor: {
      light: "#E9F7FF",
      dark: "#0056b3",
    },
  },
  {
    title: "Inspirational",
    value: "inspirational",
    icon: MdFormatQuote,
    color: "#28A745",
    backgroundColor: {
      light: "#E9FFE9",
      dark: "#19692c",
    },
  },
  {
    title: "Funny",
    value: "funny",
    icon: MdFormatQuote,
    color: "#FFC107",
    backgroundColor: {
      light: "#FFF7E6",
      dark: "#b38600",
    },
    emoji: "😂",
  },
] as const;

// The Quote block.
export const Quote = createReactBlockSpec(
  {
    type: "quote",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "motivational",
        values: ["motivational", "inspirational", "funny"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const quoteType = quoteTypes.find(
        (q) => q.value === props.block.props.type
      )!;
      const Icon = quoteType.icon;
      const emoji = quoteType.value === "funny" ? quoteType.emoji : null;
      return (
        <div className={"quote"} data-quote-type={props.block.props.type} style={{ color: props.block.props.textColor, textAlign: props.block.props.textAlignment }}>
          {/* Icon which opens a menu to choose the Quote type */}
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className={"quote-icon-wrapper"} contentEditable={false}>
                {/* <Icon
                  className={"quote-icon"}
                  data-quote-icon-type={props.block.props.type}
                  size={32}
                /> */}
              </div>
            </Menu.Target>
            {/* Dropdown to change the Quote type */}
            <Menu.Dropdown>
              <Menu.Label>Quote Type</Menu.Label>
              <Menu.Divider />
              {quoteTypes.map((type) => {
                const ItemIcon = type.icon;

                return (
                  <Menu.Item
                    key={type.value}
                    leftSection={
                      <ItemIcon
                        className={"quote-icon"}
                        data-quote-icon-type={type.value}
                      />
                    }
                    onClick={() =>
                      props.editor.updateBlock(props.block, {
                        type: "quote",
                        props: { type: type.value },
                      })
                    }>
                    {type.title}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
          <div className="quote-content-wrapper">
            <Icon className={"quote-icon"} size={32} style={{ verticalAlign: "middle" }} />
            <div className={"inline-content"} ref={props.contentRef} style={{ display: "inline", fontStyle: "italic" }} />
            <Icon className={"quote-icon"} size={32} style={{ verticalAlign: "middle" }} />
            {emoji && <span style={{ marginLeft: '8px', verticalAlign: 'middle' }}>{emoji}</span>}
          </div>
        </div>
      );
    },
  }
);

export default Quote;
