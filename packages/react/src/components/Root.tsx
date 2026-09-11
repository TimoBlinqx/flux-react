import {clsx} from 'clsx';
import type {HTMLAttributes} from 'react';
import rootStyles from '../../../components/src/css/component/Root.module.scss';

export function FluxRoot({className, ...props}: HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={clsx(rootStyles.root, className)} />;
}
