import { Link } from 'react-router-dom';

const FollowCard = ({ user, onFollow, onUnfollow, isFollowing }) => {
  return (
    <div className="flex items-center justify-between py-3.5 px-2 hover:bg-bg-tertiary/50 rounded-2xl transition-all duration-200">
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-semibold text-lg shrink-0">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-text-primary truncate text-sm">
              {user.username}
            </p>
            {user.is_private && (
              <span className="text-[10px] text-text-muted border border-border-subtle px-2 py-0.5 rounded-md shrink-0">
                Private
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary truncate">
            {user.name || (user.is_private ? "Akun Private" : "Pengguna Facegram")}
          </p>
        </div>
      </Link>

      <button
        onClick={() => isFollowing ? onUnfollow(user.username) : onFollow(user.username)}
        className={`px-5 py-1.5 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
          isFollowing
            ? "bg-transparent border border-border-default text-text-primary hover:bg-bg-tertiary"
            : "bg-primary hover:bg-primary-hover active:bg-primary-active text-white"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default FollowCard;