import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { FaCode } from "react-icons/fa";


// The types of languages that users can choose from.
export const codeLanguages = [
  {
    title: "JavaScript",
    value: "javascript",
    icon: FaCode,
  },
  {
    title: "Python",
    value: "python",
    icon: FaCode,
  },
  {
    title: "Java",
    value: "java",
    icon: FaCode,
  },
  {
    title: "C++",
    value: "cpp",
    icon: FaCode,
  },
  {
    title: "HTML",
    value: "html",
    icon: FaCode,
  },
] as const;

// The Code block.
export const CodeBlock = createReactBlockSpec(
  {
    type: "code",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      language: {
        default: "javascript",
        values: ["javascript", "python", "java", "cpp", "html"],
      },
    },
    content: "none", // Code is typically a block element
  },
  {
    render: (props) => {
      const codeLanguage = codeLanguages.find(
        (lang) => lang.value === props.block.props.language
      )!;
      const Icon = codeLanguage.icon;
      return (
        <div className={"code-block"} data-code-language={props.block.props.language} style={{ color: props.block.props.textColor, textAlign: props.block.props.textAlignment }}>
          {/* Icon which opens a menu to choose the Code language */}
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className={"code-icon-wrapper"} contentEditable={false}>
                <Icon
                  className={"code-icon"}
                  data-code-icon-language={props.block.props.language}
                  size={32}
                />
              </div>
            </Menu.Target>
            {/* Dropdown to change the Code language */}
            <Menu.Dropdown>
              <Menu.Label>Language</Menu.Label>
              <Menu.Divider />
              {codeLanguages.map((lang) => {
                const ItemIcon = lang.icon;

                return (
                  <Menu.Item
                    key={lang.value}
                    leftSection={
                      <ItemIcon
                        className={"code-icon"}
                        data-code-icon-language={lang.value}
                      />
                    }
                    onClick={() =>
                      props.editor.updateBlock(props.block, {
                        type: "code",
                        props: { language: lang.value },
                      })
                    }>
                    {lang.title}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
          <pre className="code-content-wrapper">
            <code ref={props.contentRef} className={`language-${props.block.props.language}`} style={{ display: "block" }} />
          </pre>
        </div>
      );
    },
  }
);

export default CodeBlock;
