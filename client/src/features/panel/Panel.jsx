import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectDefIds, selectUntreatedDefinitions, fetchDefinitions, randomDefinitions, treatDefinitions } from '../defs/definitionsSlice';
import Definition from '../defs/Definition';
import Switch from './Switch';
import styles from './Panel.module.css'

export const Panel = () => {
    const dispatch = useDispatch()
    const [untreatedOnly, setUntreatedOnly] = useState(false);
    const defsIds = useSelector(untreatedOnly ? selectUntreatedDefinitions : selectDefIds);

    const defsStatus = useSelector(state => state.definitions.status)
    const error = useSelector(state => state.definitions.error)

    useEffect(() => {
        if (defsStatus === 'idle') {
            dispatch(fetchDefinitions())
        }
    }, [defsStatus, dispatch])

    let content

    if (defsStatus === 'loading') {
        content = <div className="loader">Loading...</div>
    } else if (defsStatus === 'succeeded') {
        if (defsIds.length > 0) {
            content = defsIds.map(defId => (
                <Definition key={defId} defId={defId} />
            ))
        } else {
            content = <div style={{marginTop: '1em'}}>
                <div style={{fontSize: '16px'}}>No Definitions found!</div>
                <div style={{fontSize: '14px'}}>Check again later or try changing the filter</div>
            </div>
        }
    } else if (defsStatus === 'failed') {
        console.error(error);
        content = <div style={{marginTop: '1em'}}>Oh no, something went wrong!</div>
    }

    const toggleUntreated = () => {
        setUntreatedOnly(!untreatedOnly);
    }

    return (
        <div id="definitions-panel" className={styles.panel}>
            <h2 className={styles.title}>Guesty Definitions Handler</h2>
            <div className={styles.wrapper}>
                <button onClick={() => dispatch(randomDefinitions())}>Bulk generate random</button>
                <button onClick={() => dispatch(treatDefinitions())}>Treat definitions for now</button>
            </div>
            <div className={styles.wrapper}>
                <span style={{color: untreatedOnly ? '#D3D3D3' : ''}} className={styles.filterText}>All Definitions</span>
                <Switch value={untreatedOnly} toggleFn={toggleUntreated}/>
                <span style={{color: !untreatedOnly ? '#D3D3D3' : ''}} className={styles.filterText}>Untreated only</span>
            </div>
            {content}
        </div>
    )
}