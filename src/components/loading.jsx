function Loading() {
  return (
    <main style={styles.centeredMessage}>
      <div className="spinner-border text-primary" role="status">
        <h3 className="visually-hidden">Loading....</h3>
      </div>
    </main>
  );
}

function Account() {
  return (
    <main style={styles.centeredMessage}>
      <div className="spinner-border text-primary" role="status">
        <h3 className="visually-hidden">Plz Connect Wallat....</h3>
      </div>
    </main>
  );
}

export { Loading, Account };

const styles = {
  centeredMessage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",

    flexDirection: "column", // Ensures spinner and text are stacked vertically
  },
};
