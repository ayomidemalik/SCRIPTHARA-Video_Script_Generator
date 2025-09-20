'use client';

export default function LoadingSpinner() {
  return (
    <div className="spinner">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="spinner-blade"
          style={{
            transform: `rotate(${i * 45}deg) translate(0, -20px)`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}