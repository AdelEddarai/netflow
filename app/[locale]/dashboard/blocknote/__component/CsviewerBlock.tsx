import { createReactBlockSpec } from '@blocknote/react'
import CSVViewer from './DataDash/Csviewer'


const Csviewer = createReactBlockSpec(
  {
    type: 'csviewer',
    propSchema: {},
    content: 'inline',
  },
  {
    render: ({ contentRef }) => {
      return <div  ref={contentRef} className="w-full">
        <CSVViewer />
      </div>
    },
    parse: (element) => {
      if (element.tagName === 'CSVIEWER') {
        return {}
      }
    },
  }
)

// FIXME: This is a temporary solution to avoid group key same error(to other)

export { Csviewer }