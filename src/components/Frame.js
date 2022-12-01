import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  close,
  focusApp,
  minimize,
  fullscreen,
  restorescreen,
} from '../redux/taskbar/actions';
import styles from './styles/frame.module.css';
import {
  closeicon,
  maximizeicon,
  minimizeicon,
  restoreicon,
} from '../assets/icons';

const Frame = ({ appname, appicon, isminimize, children, desktopheight }) => {
  const dispatcher = useDispatch();
  const currentapp = useSelector((state) => state.taskbar[appname]);
  const titlebarref = useRef(null);
  const [newheight, setNewHeight] = useState(0);
  useEffect(() => {
    setNewHeight(desktopheight - titlebarref.current.clientHeight);
  }, [newheight, desktopheight]);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleDragEnd = (event) => {
    setX(event.clientX);
    setY(event.clientY);
  };

  return (
    <article
      className={styles.window}
      style={{
        position: 'absolute',
        top: x,
        left: y,
        width: currentapp.fullscreen ? '100%' : '400px',
        height: currentapp.fullscreen ? `${desktopheight}px` : 'min-content',
        zIndex: currentapp.top ? 1 : 0,
        display: isminimize ? 'none' : 'block',
      }}
    >
      <div className={styles.titlebar} ref={titlebarref}>
        <div
          className={styles.frametitle}
          onClick={() => dispatcher(focusApp(appname))}
          aria-hidden="true"
          draggable
          onDragEnd={handleDragEnd}
        >
          <img src={appicon} alt={appname} className={styles.appicon} />
          {appname}
        </div>
        <div className={styles.framecontrols}>
          <button
            aria-label="Minimize"
            type="button"
            onClick={() => dispatcher(minimize(appname))}
          >
            <img src={minimizeicon} alt="close" />
          </button>
          {currentapp.fullscreen ? (
            <button
              aria-label="Restore"
              type="button"
              onClick={() => dispatcher(restorescreen(appname))}
            >
              <img src={restoreicon} alt="restore" />
            </button>
          ) : (
            <button
              aria-label="Maximize"
              type="button"
              onClick={() => dispatcher(fullscreen(appname))}
            >
              <img src={maximizeicon} alt="close" />
            </button>
          )}
          <button
            aria-label="Close"
            type="button"
            onClick={() => dispatcher(close(appname))}
          >
            <img src={closeicon} alt="close" />
          </button>
        </div>
      </div>
      <div
        className={styles.windowbody}
        style={{
          height: currentapp.fullscreen ? `${newheight}px` : '800px',
        }}
      >
        {children}
      </div>
    </article>
  );
};

Frame.propTypes = {
  appname: PropTypes.string.isRequired,
  appicon: PropTypes.string.isRequired,
  isminimize: PropTypes.bool.isRequired,
  desktopheight: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default Frame;