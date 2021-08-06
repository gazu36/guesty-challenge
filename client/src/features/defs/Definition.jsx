import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Def.module.css';
import { selectDefById } from './definitionsSlice';
import logo from './Mail.png';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Definition = ({defId}) => {
  const def = useSelector(state => selectDefById(state, defId));
  
  if (!def) return <div>Error displaying the current Definition :(</div>
  
  const recurrenceDays = def?.recurrence.days.map(d => WEEKDAYS[d-1]).join(',');

  return (
    <div id={`def-${defId}`} className={styles.def} style={{backgroundColor: def.lastTreated ? '#FDE6DE' : ''}}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <img id='logo' className={styles.logoImg} src={logo} alt='Mail' />
        </div>
        <div id='data-container' className={styles.data}>
          <div className={styles.highlight}>Will be sent to {def?.recipients.join(',')}</div>
          <div className={styles.highlight}>on every {recurrenceDays} at {def?.recurrence.hour} ({def?.timezone})</div>
          <div className={styles.body}>{def?.body}</div>
        </div>
      </div>
    </div>
  );
};

export default Definition;