function Courses({ courses }) {
  return (
    <div id="courses" className="container mt-5">
      <h2>Courses</h2>
      <div className="row">
        {courses.map(c => (
          <div className="col-md-4" key={c.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{c.name}</h5>
                <p className="card-text text-muted">{c.author}</p>
                <p className="card-text">₹{c.price}</p>
                <Button disabled={!c.purchased}>Access Course</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
