import { createReactBlockSpec } from '@blocknote/react'


const BlockQuoteBlock = createReactBlockSpec(
  {
    type: 'blockquote',
    propSchema: {},
    content: 'inline',
  },
  {
    render: ({ contentRef }) => {
      return <blockquote
      ref={contentRef}
      className="italic p-4 border-l-4 text-gray-600"
      ></blockquote>

    },
    parse: (element) => {
      if (element.tagName === 'BLOCKQUOTE') {
        return {}
      }
    },
  }
)

// FIXME: This is a temporary solution to avoid group key same error(to other)

export { BlockQuoteBlock }