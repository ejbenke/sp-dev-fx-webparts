import * as React from 'react';
import styles from './KanbanBucket.module.scss';
import { IKanbanBucket } from './IKanbanBucket';
import { IKanbanTask } from './IKanbanTask';
import { IKanbanBoardTaskSettings } from './IKanbanBoardTaskSettings';
import { IKanbanBoardTaskActions } from './IKanbanBoardTaskActions';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { ActionButton } from 'office-ui-fabric-react';
import KanbanTask from './KanbanTask';
import classNames from 'classnames';
import * as strings from 'KanbanBoardStrings';

export interface IKanbanBucketProps extends IKanbanBucket {
    buckettasks: IKanbanTask[];
    tasksettings: IKanbanBoardTaskSettings;


    toggleCompleted?: (taskId: string) => void;
    addTask?: (bucket: string) => void;

    onDragStart: (event, taskId: string, bucket: string) => void;
    onDragOver: (event, targetbucket: string) => void;
    onDragLeave: (event, targetbucket: string) => void;
    onDrop: (event, targetbucket: string) => void;
    onDragEnd: (event, taskId: string, bucket: string) => void;



    leavingTaskId?: string;
    leavingBucket?: string;
    overBucket?: string;

    openDetails?: (taskId: string) => void;
}

export interface IKanbanBucketState { }

export default class KanbanBucket extends React.Component<IKanbanBucketProps, IKanbanBucketState> {

    constructor(props: IKanbanBucketProps) {
        super(props);

        this.state = {

        };

    }
    /*
    nice to use a object merge
    ECMAScript 2018 Standard Method
    {...t, ...tasksettings, ...taskactions}
    hope this will be translated 
    */
    public render(): React.ReactElement<IKanbanBucketProps> {
        const { bucket, bucketheadline, color, buckettasks,
            tasksettings, percentageComplete,
            allowAddTask, overBucket, leavingTaskId, leavingBucket } = this.props;
debugger;
        return (
            <div
                className={classNames({ [styles.bucket]: true, [styles.dragover]: !!(overBucket && overBucket === bucket) })}
                key={bucket}
                onDragOver={(event) => this.props.onDragOver(event, bucket)}
                onDragLeave={(event) => this.props.onDragLeave(event, bucket)}
                onDrop={(event) => this.props.onDrop(event, bucket)}
            >
                <div className={styles.headline}

                >
                    <span>{bucketheadline}</span>
                    {color && <div style={{ backgroundColor: color }} className={styles.colorindicator}></div>}
                    <ProgressIndicator percentComplete={percentageComplete / 100} />
                </div>
                {allowAddTask && (<ActionButton
                    iconProps={{ iconName: 'Add' }}
                    allowDisabledFocus={true}
                    onClick={() => this.props.addTask(bucket)}
                >
                    {strings.AddTask}
                </ActionButton>)}
                {
                    buckettasks.map((t) => {
                        const merge = { ...t, ...tasksettings, };
                        const isMoving = (t.taskId === leavingTaskId && t.bucket === leavingBucket);

                        return (<div className={isMoving ? styles.placeholder : undefined} key={'' + t.taskId} >
                            <KanbanTask
                                key={'task' + t.taskId}
                                {...merge}
                                toggleCompleted={this.props.toggleCompleted}
                                isMoving={isMoving}
                                openDetails={this.props.openDetails}
                                onDragStart={(event) => this.props.onDragStart(event, t.taskId, t.bucket)}
                                onDragEnd={(event) => this.props.onDragEnd(event, t.taskId, t.bucket)}
                            /></div>
                        );
                    })
                }
            </div >
        );
    }



}
