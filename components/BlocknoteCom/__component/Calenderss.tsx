import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { MdEvent } from "react-icons/md";

// The types of calendar events that users can choose from.
export const calendarEventTypes = [
  {
    title: "Meeting",
    value: "meeting",
    icon: MdEvent,
    color: "#007bff",
    backgroundColor: {
      light: "#cce5ff",
      dark: "#004085",
    },
  },
  {
    title: "Appointment",
    value: "appointment",
    icon: MdEvent,
    color: "#28a745",
    backgroundColor: {
      light: "#d4edda",
      dark: "#155724",
    },
  },
  {
    title: "Task",
    value: "task",
    icon: MdEvent,
    color: "#ffc107",
    backgroundColor: {
      light: "#fff3cd",
      dark: "#664d03",
    },
  },
] as const;

// The Calendar block.
export const Calendar = createReactBlockSpec(
  {
    type: "calendar",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      eventType: {
        default: "meeting",
        values: ["meeting", "appointment", "task"],
      },
      startDate: {
        default: new Date().toISOString(), // Default to current date
      },
      endDate: {
        default: new Date().toISOString(), // Default to current date
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const eventType = calendarEventTypes.find(
        (e) => e.value === props.block.props.eventType
      )!;
      const Icon = eventType.icon;
      return (
        <div className="calendar p-4 border rounded shadow-md">
          {/* Icon which opens a menu to choose the event type */}
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className="calendar-icon-wrapper" contentEditable={false}>
                <Icon
                  className="calendar-icon text-4xl"
                  data-event-icon-type={props.block.props.eventType}
                />
              </div>
            </Menu.Target>
            {/* Dropdown to change the event type */}
            <Menu.Dropdown>
              <Menu.Label>Event Type</Menu.Label>
              <Menu.Divider />
              {calendarEventTypes.map((type) => {
                const ItemIcon = type.icon;

                return (
                  <Menu.Item
                    key={type.value}
                    leftSection={
                      <ItemIcon
                        className="calendar-icon"
                        data-event-icon-type={type.value}
                      />
                    }
                    onClick={() =>
                      props.editor.updateBlock(props.block, {
                        type: "calendar",
                        props: { eventType: type.value },
                      })
                    }
                  >
                    {type.title}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
          {/* Date inputs */}
          <div className="mt-4">
            <Label htmlFor="start-date" className="block text-sm font-medium text-gray-50">
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              defaultValue={props.block.props.startDate}
              onChange={(e) =>
                props.editor.updateBlock(props.block, {
                  type: "calendar",
                  props: { ...props.block.props, startDate: e.target.value },
                })
              }
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="end-date" className="block text-sm font-medium text-gray-50">
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-900 rounded-md"
              defaultValue={props.block.props.endDate}
              onChange={(e) =>
                props.editor.updateBlock(props.block, {
                  type: "calendar",
                  props: { ...props.block.props, endDate: e.target.value },
                })
              }
            />
          </div>
          {/* Rich text field for user to type in */}
          <div className="mt-4">
            <Label htmlFor="event-description" className="block text-sm font-medium dark:text-gray-50 text-gray-700">
              Event Description
            </Label>
            <div
              className="mt-1 p-2 border border-gray-50 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm"
              contentEditable={true}
              ref={props.contentRef}
            ></div>
          </div>
        </div>
      );
    },
  }
);
