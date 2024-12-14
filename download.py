import os
import yt_dlp
from pytubefix.innertube import _default_clients
_default_clients["ANDROID_MUSIC"] = _default_clients["WEB"]


def download_mp3_v2(url):
        curr_dir = os.getcwd()
        output_dir = os.path.join(curr_dir,"tmp")
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(output_dir,'test.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3'
            }],
            # "cookiefile": os.path.join(curr_dir,"cookies.txt")
            
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            res = ydl.download(url)
        print(res)
        return os.path.join(output_dir,'test.mp3')

url = "https://www.youtube.com/watch?v=00x0S4jhsPo"
downloaded_dir = download_mp3_v2(url)
