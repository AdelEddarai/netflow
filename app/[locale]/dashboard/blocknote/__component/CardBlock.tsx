import { Menu } from "@mantine/core";
import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BsArrowLeftShort } from "react-icons/bs";

type AlertType = "warning" | "error" | "info" | "success" | undefined;

const cardTypes = [
  {
    title: "Warning",
    value: "warning" as const,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Error",
    value: "error" as const,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Info",
    value: "info" as const,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Success",
    value: "success" as const,
    color: "#0bc10b",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "#208020",
    },
  },
];



export const CardBlock = createReactBlockSpec(
  {
    type: "card",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning" as const,
        values: ["warning", "error", "info", "success"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const alertType = cardTypes.find((a) => a.value === props.block.props.type);

      return (
        <div className="flex items-center">
          {/* Menu with dropdown to change alert type */}
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className="flex-shrink-0 mr-2">
                {/* Placeholder for icon */}
                <div
                  className="text-2xl"
                  style={{ color: alertType?.color }}
                  data-alert-icon-type={props.block.props.type}
                >
                  {/* You can place an icon here if needed */}
                </div>
              </div>
            </Menu.Target>
            {/* Dropdown menu */}
            <Menu.Dropdown>
              <Menu.Label>Alert Type</Menu.Label>
              <Menu.Divider />
              {cardTypes.map((type) => (
                <Menu.Item
                  key={type.value}
                  onClick={() =>
                    props.editor.updateBlock(props.block, {
                      type: "card",
                      props: { type: type.value },
                    })
                  }
                >
                  <div className="flex items-center">
                    {/* Placeholder for icon */}
                    <div
                      className="text-xl mr-2"
                      style={{ color: type.color }}
                    >
                      {/* You can place an icon here if needed */}
                    </div>
                    {type.title}
                  </div>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          {/* Card for alert type */}
          <Card>
            <CardHeader>
              <CardDescription>
                Card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">
                This is a card styled like a Kanban backlog item.
              </p>
            </CardContent>
          
          </Card>
        </div>
      );
    },
  }
);
