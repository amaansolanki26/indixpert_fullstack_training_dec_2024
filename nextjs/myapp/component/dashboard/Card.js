"use client";

const Card = ({ user }) => {
    return (
        <div className="relative bg-white rounded-2xl shadow-md border p-5">
            <div className="absolute top-3 right-3">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    #{user.id}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold uppercase">
                    {user.name?.charAt(0)}
                </div>

                <div>
                    <h2 className="text-lg font-semibold">
                        {user.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="my-4 border-t"></div>

            <div className="space-y-2 text-sm">
                <p>📞 {user.contact}</p>
                <p>📍 {user.state}</p>
                <p>🏙️ {user.city}</p>
            </div>
        </div>
    );
};

export default Card;