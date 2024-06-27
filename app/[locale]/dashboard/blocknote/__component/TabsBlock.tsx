import { Menu } from "@mantine/core";
import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type tabsType = "main" | "head" | "info" | undefined;

const tabsTypes = [
  {
    title: "Main",
    value: "main" as const,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Head",
    value: "head" as const,
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
];


export const TabsBlock = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "main" as const,
        values: ["main", "head", "info"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const tabsType = tabsTypes.find((a) => a.value === props.block.props.type);

      return (
        <div className="flex items-center">
          {/* Menu with dropdown to change alert type */}
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className="flex-shrink-0 mr-2">
                {/* Placeholder for icon */}
                <div
                  className="text-2xl"
                  style={{ color: tabsType?.color }}
                  data-alert-icon-type={props.block.props.type}
                >
                  {/* You can place an icon here if needed */}
                </div>
              </div>
            </Menu.Target>
            {/* Dropdown menu */}
            <Menu.Dropdown>
              <Menu.Label>Tabs Type</Menu.Label>
              <Menu.Divider />
              {tabsTypes.map((type) => (
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
          {/* Card for alert type */}
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">kyne</TabsTrigger>
                <TabsTrigger value="password">kyne</TabsTrigger>
            </TabsList>
            <TabsContent value="account">kyne</TabsContent>
            <TabsContent value="password">kyne</TabsContent>
            </Tabs>

        </div>
      );
    },
  }
);
