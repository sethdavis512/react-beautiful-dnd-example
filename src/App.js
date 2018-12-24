import React, { Component } from 'react';
import './App.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const COLUMN_A = 'column-A';
const COLUMN_B = 'column-B';

const ElementBox = ({ element, id, index }) => {
    return (
        <Draggable draggableId={id} index={index}>
            {provided => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="box"
                    ref={provided.innerRef}
                >
                    <img
                        src="https://img.icons8.com/metro/50/000000/resize-four-directions.png"
                        width="12"
                        alt="Drag and drop handle"
                        style={{ marginRight: '0.5em' }}
                    />
                    {element}
                </div>
            )}
        </Draggable>
    );
};

const Column = ({ columnId, columns }) => (
    <Droppable droppableId={columnId}>
        {provided => (
            <div
                {...provided.droppableProps}
                className="grid-column"
                ref={provided.innerRef}
            >
                {columns}
            </div>
        )}
    </Droppable>
);

class App extends Component {
    state = {
        [COLUMN_A]: ['Nitrogen', 'Helium', 'Chlorine'],
        [COLUMN_B]: ['Cobalt']
    };

    handleDragEnd = result => {
        const { destination, source, draggableId } = result;
        const [draggedEl] = draggableId.split('-');

        // Immediately exit if no desination
        if (!destination) {
            return;
        }

        // Same Column
        const sameColumn = source.droppableId === destination.droppableId;

        if (sameColumn) {
            const column = destination.droppableId;
            const targetArray = [...this.state[column]];

            targetArray.splice(source.index, 1);
            targetArray.splice(destination.index, 0, draggedEl);

            this.setState({ [column]: targetArray });
        } else {
            this.setState(prevState => {
                const sourceArr = prevState[source.droppableId].filter(
                    el => el !== draggedEl
                );

                const destinationArr = [...prevState[destination.droppableId]];
                destinationArr.splice(destination.index, 0, draggedEl);

                return {
                    [source.droppableId]: sourceArr,
                    [destination.droppableId]: destinationArr
                };
            });
        }
    };

    render() {
        const makeElement = (el, index) => {
            const elementId = `${el}-${index}`;
            return (
                <ElementBox
                    element={el}
                    index={index}
                    id={elementId}
                    key={elementId}
                />
            );
        };

        const mappedColumnA = this.state[COLUMN_A].map(makeElement);
        const mappedColumnB = this.state[COLUMN_B].map(makeElement);

        const columnArr = [
            { id: COLUMN_A, columns: mappedColumnA },
            { id: COLUMN_B, columns: mappedColumnB }
        ];

        const mappedColumns = columnArr.map(col => (
            <Column columnId={col.id} columns={col.columns} />
        ));

        return (
            <div className="app">
                <DragDropContext onDragEnd={this.handleDragEnd}>
                    <div className="grid-container">{mappedColumns}</div>
                </DragDropContext>
            </div>
        );
    }
}

export default App;
