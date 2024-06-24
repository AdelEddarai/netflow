import { Menu } from "@mantine/core";
import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";
import { Badge } from "@/components/ui/badge";

type AlertType = "warning" | "error" | "info" | "success" | undefined;

const badgeTypes = [
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

export const BadgeBlock = createReactBlockSpec(
  {
    type: "alert",
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
      const alertType = badgeTypes.find((a) => a.value === props.block.props.type);

      // Map outline and filled to appropriate Badge variants
      const badgeVariant =
        props.block.props.type === "success" ? "outline" :
        props.block.props.type === "error" ? "destructive" :
        props.block.props.type === "info" ? "secondary" :
        props.block.props.type === "warning" ? "default" : "default";

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
              {badgeTypes.map((type) => (
                <Menu.Item
                  key={type.value}
                  onClick={() =>
                    props.editor.updateBlock(props.block, {
                      type: "alert",
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
          {/* Badge for alert type */}
          <Badge
            variant={badgeVariant}
            color={alertType?.color}
            style={{ marginLeft: "10px" }}
          >
            {props.block.props.type}
          </Badge>
        </div>
      );
    },
  }
);
