import React from 'react';
import { Link } from 'react-router';

export const link = (href, label) => (
  <Link
    dangerouslySetInnerHTML={{ __html: label }}
    to={{ pathname: href }}
  />
);
