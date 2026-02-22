# Mysta's images

The images are extracted from my phone where I have turned on image location on
pictures. Before uploading they should be removed.

```bash
$ exiftool -all= -overwrite_original .
```

Required dependencies:

```bash
# Install on Debian/Ubuntu/WSL
$ sudo apt install libimage-exiftool-perl

# Arch
$ sudo pacman -S perl-image-exiftool
```
