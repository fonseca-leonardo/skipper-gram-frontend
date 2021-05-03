import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
    padding-top: 130px;
`;


const PageContainer: React.FC = ({ children }) =>  {
    return (
        <Container>
            {children}
        </Container>
    )
}

export default PageContainer;