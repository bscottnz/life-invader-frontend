// to save me copying this into each modal

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, .9)',
    height: 'calc(100vh + 100px)',
    zIndex: 3,
  },
  content: {
    backgroundColor: 'rgb(21, 24, 28)',
    maxWidth: '600px',
    height: 'fit-content',
    zIndex: 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 'calc(50% - 50px)',
    left: '10px',
    right: '10px',
    // transform: 'translateY(-50%)',
    borderRadius: '15px',
    border: '1px solid #3a3a3a',
    border: 'none',
  },
};

export default modalStyle;
