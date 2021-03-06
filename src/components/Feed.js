import React from 'react';
import { string, bool, func, arrayOf } from 'prop-types';
import styled from 'styled-components';
import { DuckContainer } from 'containers';
import { NewDucksAvailable, Spinner } from 'components';
import { errorMsg, subHeader } from 'sharedStyles';

Feed.propTypes = {
  duckIds: arrayOf(string).isRequired,
  error: string.isRequired,
  isFetching: bool.isRequired,
  newDucksAvailable: bool.isRequired,
  resetNewDucksAvailable: func.isRequired
};

function Feed({
  duckIds,
  error,
  isFetching,
  newDucksAvailable,
  resetNewDucksAvailable
}) {
  return isFetching === true
    ? <Spinner />
    : (
      <div>
        <Header>Feed</Header>
        {
          newDucksAvailable
            ? <NewDucksAvailable handleClick={resetNewDucksAvailable} />
            : null
        }
        {
          duckIds.length === 0
            ? (
              <NoDucks>
                {'Well, this is unfortunate.'}
                <br />
                {'It appears there are no ducks yet! 😞'}
              </NoDucks>
            )
            : null
        }
        {
          duckIds.map(id => (
            <DuckContainer
              duckId={id}
              key={id}
            />
          ))
        }
        {
          error
            ? <ErrorMsg>{error}</ErrorMsg>
            : null
        }
      </div>
    );
}

const Header = styled.h1`
  ${subHeader}
`;

const NoDucks = Header.extend`
  font-size: 25px;
`;

const ErrorMsg = styled.p`
  ${errorMsg}
`;

export default Feed;
