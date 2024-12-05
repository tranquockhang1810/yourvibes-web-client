import React from 'react'

const Demo = ({
  params,
}: {
  params: { slug: string }
}) => {
  return (
    <>{params.slug}</>
  )
}

export default Demo