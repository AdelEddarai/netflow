import { createReactBlockSpec } from '@blocknote/react'
import MermaidEditor from './BlocknoteBlocks/MermaidBlock'


const DiagramBlock = createReactBlockSpec(
  {
    type: 'diagram',
    propSchema: {},
    content: 'inline',
  },
  {
    render: ({ contentRef }) => {
      return <div  ref={contentRef} className="w-full">
        <MermaidEditor />
      </div>
    },
    parse: (element) => {
      if (element.tagName === 'DIAGRAM') {
        return {}
      }
    },
  }
)

// FIXME: This is a temporary solution to avoid group key same error(to other)
// TODO we need to work on diagram in dev and in publish

export { DiagramBlock }