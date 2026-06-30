import { Link } from 'react-router-dom';

const FollowCard = ({ user, onFollow, onUnfollow, isFollowing }) => {
  return (
    <div className="flex items-center justify-between py-3 px-1 hover:bg-bg-tertiary/50 rounded-2xl transition">
      <Link 
        to={`/profile/${user.username}`} 
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        {/* Avatar */}
        <div className="w-11 h-11 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold text-xl shrink-0">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-text-primary truncate">
              {user.username}
            </p>
            {user.is_private && (
              <span className="text-[10px] text-text-muted border border-slate-500/20 px-2 py-0.5 rounded-full shrink-0">
                Private
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary truncate">
            {user.name || (user.is_private ? "Akun Private" : "Pengguna Facegram")}
          </p>
        </div>
      </Link>

      {/* Follow Button */}
      <button
        onClick={() => isFollowing ? onUnfollow(user.username) : onFollow(user.username)}
        className={`px-6 py-1.5 text-sm font-semibold rounded-2xl transition-all duration-200 ${
          isFollowing 
            ? "bg-transparent border border-slate-500/15 text-text-primary hover:bg-bg-tertiary" 
            : "bg-primary hover:bg-primary-hover text-white"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default FollowCard;