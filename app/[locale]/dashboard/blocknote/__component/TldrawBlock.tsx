"use client"

// Import necessary modules
import React from "react";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { Tldraw } from "tldraw";
import { RiBrushFill } from "react-icons/ri";

// Define types for Tldraw options
export const tldrawTypes = [
  {
    title: "Sketch",
    value: "sketch",
    icon: RiBrushFill,
  },
];

// Register Tldraw block
export const TldrawBlock = createReactBlockSpec(
  {
    type: "tldraw", // Ensure type matches here
    propSchema: {
      drawType: {
        default: "sketch",
        values: tldrawTypes.map((type) => type.value),
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const drawType = props.block.props.drawType;
      const Icon = tldrawTypes.find((d) => d.value === drawType)!.icon;
      return (
        <div className="tldraw p-4 border rounded shadow-md">
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className="tldraw-icon-wrapper" contentEditable={false}>
                <Icon
                  className="tldraw-icon text-4xl"
                  data-draw-icon-type={drawType}
                />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Tldraw Type</Menu.Label>
              <Menu.Divider />
              {tldrawTypes.map((type) => {
                const ItemIcon = type.icon;
                return (
                  <Menu.Item
                    key={type.value}
                    leftSection={
                      <ItemIcon
                        className="tldraw-icon"
                        data-draw-icon-type={type.value}
                      />
                    }
                    onClick={() =>
                      props.editor.updateBlock(props.block, {
                        type: "tldraw",
                        props: { drawType: type.value },
                      })
                    }
                  >
                    {type.title}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
          <div style={{ position: "relative", height: "400px" }}>
            <Tldraw />
          </div>
        </div>
      );
    },
  }
);
