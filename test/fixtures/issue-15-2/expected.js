import React from 'react';
import { omit } from 'underscore';

import Bar from './bar';

const { PropTypes } = React;

export default function Foo(props) {
  const barProps = omit(props, Object.keys(Foo.propTypes));
  return <Bar {...barProps} />;
}

Foo.propTypes = {
  foo: PropTypes.any
};
