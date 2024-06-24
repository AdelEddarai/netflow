import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { MdCancel, MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import "./style.css"; // Your additional styles if needed
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  



// The types of alerts that users can choose from.
export const cardTypes = [
  {
    title: "Warning",
    value: "warning",
    icon: MdError,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Error",
    value: "error",
    icon: MdCancel,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Info",
    value: "info",
    icon: MdInfo,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Success",
    value: "success",
    icon: MdCheckCircle,
    color: "#0bc10b",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "#208020",
    },
  },
] as const;

// The Alert block.
export const CardBlock = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning",
        values: ["warning", "error", "info", "success"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const alertType = cardTypes.find(
        (a) => a.value === props.block.props.type
      )!;
      const Icon = alertType.icon;

      return (
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <div className="flex items-center">
              {/* Icon which opens a menu to choose the Alert type */}
              <Menu withinPortal={false} zIndex={999999}>
                <Menu.Target>
                  <div className="flex-shrink-0 mr-2">
                    <Icon
                      className="text-2xl"
                      style={{ color: alertType.color }}
                      data-alert-icon-type={props.block.props.type}
                    />
                  </div>
                </Menu.Target>
                {/* Dropdown to change the Alert type */}
                <Menu.Dropdown>
                  <Menu.Label>Alert Type</Menu.Label>
                  <Menu.Divider />
                  {cardTypes.map((type) => {
                    const ItemIcon = type.icon;

                    return (
                      <Menu.Item
                        key={type.value}
                        leftSection={
                          <ItemIcon
                            className="text-xl"
                            style={{ color: type.color }}
                            data-alert-icon-type={type.value}
                          />
                        }
                        onClick={() =>
                          props.editor.updateBlock(props.block, {
                            type: "alert",
                            props: { type: type.value },
                          })
                        }
                      >
                        {type.title}
                      </Menu.Item>
                    );
                  })}
                </Menu.Dropdown>
              </Menu>
              {/* Card Title (Alert type) */}
              <CardTitle>{props.block.props.type}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Rich text field for user to type in */}
            <div
              className="text-gray-800"
              contentEditable={true}
              ref={props.contentRef}
            />
          </CardContent>
          <CardFooter>
          <CardTitle>{props.block.props.type}</CardTitle>
          </CardFooter>
        </Card>
      );
    },
  }
);
