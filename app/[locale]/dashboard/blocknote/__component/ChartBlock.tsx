/* eslint-disable react-hooks/rules-of-hooks */
import { createReactBlockSpec } from '@blocknote/react'
import ChartFiltering from './ChartFiltering'
import { useState } from 'react';


const ChartBlock = createReactBlockSpec(
  {
    type: 'chartblock',
    propSchema: {},
    content: 'inline',
  },
  {
    render: ({ contentRef }) => {
      const [csvData, setCsvData] = useState<string>('');
      const [searchTerm, setSearchTerm] = useState('');
      const [numericFilters, setNumericFilters] = useState<{ [key: string]: { condition: '>' | '<'; value: number } | null }>({});

      return <div
      className='w-full'
      ref={contentRef}
      >
        <ChartFiltering
                csvData={csvData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                numericFilters={numericFilters}
                setNumericFilters={setNumericFilters}
              />
      </div>

    },
    parse: (element) => {
      if (element.tagName === 'BLOCKQUOTE') {
        return {}
      }
    },
  }
)

// FIXME: This is a temporary solution to avoid group key same error(to other)

export { ChartBlock }