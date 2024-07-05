import React from 'react';
import { useParams } from 'react-router-dom';

const DocumentPage: React.FC = () => {
    const { documentId } = useParams();

    console.log(documentId);

    return <div>DocumentPage</div>;
};

export default DocumentPage;
