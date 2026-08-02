export default function CourseCard({ course, onBuyNow }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col border border-slate-100">
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="w-full h-36 sm:h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 text-base sm:text-lg line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1">By {course.authorName}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-bold text-purple-600 text-lg">₹{course.price}</span>
          <button
            onClick={() => onBuyNow(course)}
            className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}