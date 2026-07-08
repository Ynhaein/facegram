import { useState, useRef } from "react";
import api from "../../api";
import { IoClose } from "react-icons/io5";
import { BiSolidImageAdd } from "react-icons/bi";
import { usePostPopup } from "../../contexts/PostPopupContext";

const PostPopup = () => {
  const { isOpen, closePopup } = usePostPopup();
  const [form, setForm] = useState({ caption: "" });
  const [attachments, setAttachments] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const token = localStorage.getItem('auth_token')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setAttachments(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const removeFile = (i) => {
    const updated = attachments.filter((_, idx) => idx !== i);
    setAttachments(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attachments.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("caption", form.caption);

    attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });

    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        closePopup();
        location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closePopup}
      />

      <div
        className="relative w-full max-w-lg bg-bg-secondary rounded-3xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-subtle">
          <h2 className="text-xl font-bold text-text-primary -tracking-0.5">
            Buat postingan
          </h2>
          <button
            onClick={closePopup}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg-tertiary text-text-muted hover:text-text-primary hover:bg-bg-tertiary/80 transition cursor-pointer"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <textarea
            name="caption"
            value={form.caption}
            onChange={handleChange}
            placeholder="Apa yang sedang kamu pikirkan?"
            rows={4}
            className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm leading-relaxed transition"
          />

          <div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden bg-bg-tertiary">
                    <img
                      src={url}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border-default flex flex-col items-center justify-center gap-1 text-text-muted hover:border-primary/50 hover:text-primary transition cursor-pointer"
                >
                  <BiSolidImageAdd className="text-2xl" />
                  <span className="text-[11px] font-medium">Tambah</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full py-10 rounded-2xl border-2 border-dashed border-border-default flex flex-col items-center justify-center gap-2 text-text-muted hover:border-primary/50 hover:text-primary hover:bg-bg-tertiary/30 transition cursor-pointer"
              >
                <BiSolidImageAdd className="text-3xl" />
                <span className="text-sm font-medium">Pilih gambar</span>
                <span className="text-xs text-text-muted/60">JPEG, PNG, WebP</span>
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closePopup}
              className="flex-1 py-3 rounded-xl border border-border-default text-text-primary font-medium hover:bg-bg-tertiary transition cursor-pointer active:scale-[0.98]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || attachments.length === 0}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengunggah...
                </span>
              ) : (
                "Posting"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPopup;
