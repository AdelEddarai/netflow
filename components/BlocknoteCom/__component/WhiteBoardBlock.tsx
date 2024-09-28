import { createReactBlockSpec } from '@blocknote/react'
import StyledWhiteboard from './TldrawBlock'


const Blockboard = createReactBlockSpec(
  {
    type: 'blockboard',
    propSchema: {},
    content: 'inline',
  },
  {
    render: ({ contentRef }) => {
      return <div  ref={contentRef} className="w-full">
        <StyledWhiteboard />
      </div>
    },
    parse: (element) => {
      if (element.tagName === 'BLOCKBOARD') {
        return {}
      }
    },
  }
)

// FIXME: This is a temporary solution to avoid group key same error(to other)

export { Blockboard }