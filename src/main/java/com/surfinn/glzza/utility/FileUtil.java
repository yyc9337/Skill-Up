package com.surfinn.glzza.utility;

import java.io.*;
import java.nio.charset.Charset;
import java.security.MessageDigest;

public class FileUtil {

   private FileUtil() {
   }

   public static String getExtension(String pfileName) {
      String file_name = pfileName;
      
      if (file_name != null && !file_name.trim().equals("")) {
         String file_separator = "\\"; // Windows format
         if (file_name.startsWith("/")) { // Unix format
            file_separator = "/";
         }
         if (file_name.lastIndexOf(file_separator) != -1) {
            file_name = file_name.substring(file_name.lastIndexOf(file_separator) + 1);
         }
         String file_ext = "";
         if (file_name.lastIndexOf(".") != -1) {
            file_ext = file_name.substring(file_name.lastIndexOf("."));
            return file_ext;
         }
      }

      return "";
   }

   /** Copy a File
    * The renameTo method does not allow action across NFS mounted filesystems
    * this method is the workaround
    *
    * @param src_fp The existing File
    * @param dest_fp The new File
    * @return  <code>true</code> if and only if the renaming succeeded;
    *          <code>false</code> otherwise
    */
   public final static boolean copy(File src_fp, File dest_fp) {
      FileInputStream in = null;
      FileOutputStream out = null;
      BufferedInputStream inBuffer = null;
      BufferedOutputStream outBuffer = null;
      try {
         in = new FileInputStream(src_fp);
         out = new FileOutputStream(dest_fp);
         inBuffer = new BufferedInputStream(in);
         outBuffer = new BufferedOutputStream(out);

         int numofbytes = 0;
         byte[] buffer = new byte[8192];
         while ((numofbytes = inBuffer.read(buffer, 0, buffer.length)) > -1) {
            outBuffer.write(buffer, 0, numofbytes);
         }
         outBuffer.flush();
         // cleanupif files are not the same length
         if (src_fp.length() != dest_fp.length()) {
            dest_fp.delete();
            return false;
         }

         return true;
      } catch (Exception e) {
         dest_fp.delete();
         return false;
      } finally {
         if (outBuffer != null) {
            try {
               outBuffer.close();
            } catch (Exception ex) {
               outBuffer = null;
            } finally {
               outBuffer = null;
            }
         }
         if (inBuffer != null) {
            try {
               inBuffer.close();
            } catch (Exception ex) {
               inBuffer = null;
            } finally {
               inBuffer = null;
            }
         }
         if (out != null) {
            try {
               out.close();
            } catch (Exception ex) {
               out = null;
            } finally {
               out = null;
            }
         }
         if (in != null) {
            try {
               in.close();
            } catch (Exception ex) {
               in = null;
            } finally {
               in = null;
            }
         }
      }
   }

   /** Move a File
    * The renameTo method does not allow action across NFS mounted filesystems
    * this method is the workaround
    *
    * @param src_fp The existing File
    * @param dest_fp The new File
    * @return  <code>true</code> if and only if the renaming succeeded;
    *          <code>false</code> otherwise
    */
   public final static boolean move(File src_fp, File dest_fp) {
      if (src_fp.renameTo(dest_fp)) {
         return true;
      }

      try {
         if (dest_fp.createNewFile()) {
            // delete if copy was successful, otherwise move will fail
            if (copy(src_fp, dest_fp)) {
               return src_fp.delete();
            }
         }
      } catch (IOException ex) {
         return false;
      }

      return false;
   }

   /** Move a File
    * The renameTo method does not allow action across NFS mounted filesystems
    * this method is the workaround
    *
    * @param fp The existing File
    * @param path The new File path
    * @return  <code>true</code> if and only if the renaming succeeded;
    *          <code>false</code> otherwise
    */
   public static boolean move(File fp, String path) {
      File new_fp = new File(path);
      if (fp.renameTo(new_fp)) {
         return true;
      }

      try {
         if (new_fp.createNewFile()) {
            // delete if copy was successful, otherwise move will fail
            if (copy(fp, new_fp)) {
               return fp.delete();
            }
         }
      } catch (IOException ex) {
         return false;
      }

      return false;
   }

   public static boolean makeDirs(String path) {
      if (path == null) {
         return false;
      }
      File fp = new File(path);
      if (fp.exists()) {
         return true;
      }
      return fp.mkdirs();
   }

   public static boolean makeDir(String path, boolean create) {
      if (path == null) {
         return false;
      }
      File fp = new File(path);

      if (create == true) {
         if (fp.exists()) {
            return true;
         }
         return fp.mkdirs();
      } else {
         return fp.mkdir();
      }
   }

   public static boolean remove(String file) {
      if (file == null) {
         return true;
      }
      File fp = new File(file);

      if (fp.exists()) {
         return fp.delete();
      }
      return true;
   }

   public static boolean remove(File fp) {
      if (fp != null && fp.exists()) {
         return fp.delete();
      }
      return true;
   }

   public static boolean exists(String file) {
      if (file == null) {
         return false;
      }
      File fp = new File(file);
      return fp.exists();
   }

   public static long size(String file) {
      if (file == null) {
         return 0;
      }
      File fp = new File(file);
      if (fp.exists()) {
         return fp.length();
      }
      return 0;
   }

   public static byte[] getMd5(File fp) {
      MessageDigest md = null;
      BufferedInputStream in = null;
      byte[] buffer = null;
      try {
         md = MessageDigest.getInstance("MD5");
         in = new BufferedInputStream(new FileInputStream(fp));
         int numofbytes = 0;
         buffer = new byte[8192];
         while ((numofbytes = in.read(buffer, 0, buffer.length)) > -1) {
            md.update(buffer, 0, numofbytes);
         }
         return md.digest();
      } catch (Exception ex) {
         return new byte[0];
      } finally {
         if (in != null) {
            try {
               in.close();
            } catch (Exception ex) {
               in = null;
            } finally {
               in = null;
            }
         }
         md = null;
         buffer = null;
      }
   }

   public static byte[] getMd5(String filePath) {
      MessageDigest md = null;
      BufferedInputStream in = null;
      byte[] buffer = null;
      try {
         md = MessageDigest.getInstance("MD5");
         in = new BufferedInputStream(new FileInputStream(new File(filePath)));
         int numofbytes = 0;
         buffer = new byte[8192];
         while ((numofbytes = in.read(buffer, 0, buffer.length)) > -1) {
            md.update(buffer, 0, numofbytes);
         }
         return md.digest();
      } catch (Exception ex) {
         return new byte[0];
      } finally {
         if (in != null) {
            try {
               in.close();
            } catch (Exception ex) {
               in = null;
            } finally {
               in = null;
            }
         }
         md = null;
         buffer = null;
      }
   }

   public static byte[] toBytes(String path) {
      if (path == null) {
         return new byte[0];
      }
      ByteArrayOutputStream bao = null;
      byte[] buffer = new byte[8192];
      int numOfBytes = -1;
      byte[] result;
      BufferedInputStream bsi = null;
      try {
         bao = new ByteArrayOutputStream();
         bsi = new BufferedInputStream(new FileInputStream(path));
         while ((numOfBytes = bsi.read(buffer, 0, buffer.length)) != -1) {
            bao.write(buffer, 0, numOfBytes);
         }
         result = bao.toByteArray();
         if (bao != null) {
            bao.close();
         }
         if (bsi != null) {
            bsi.close();
         }
      } catch (Exception ex) {
         result = new byte[0];
         bao = null;
         bsi = null;
      } finally {
         bao = null;
         bsi = null;
      }
      
      return result;
   }

   public static byte[] streamToBytes(InputStream in) throws IOException {
      ByteArrayOutputStream bao = null;
      byte[] buffer = new byte[8192];
      int numOfBytes = -1;
      BufferedInputStream bsi = null;
      try {
         bao = new ByteArrayOutputStream();
         bsi = new BufferedInputStream(in);
         while ((numOfBytes = bsi.read(buffer, 0, buffer.length)) != -1) {
            bao.write(buffer, 0, numOfBytes);
         }
         return bao.toByteArray();
      } catch (Exception ex) {
         return new byte[0];
      } finally {
         if (bao != null) {
            bao.close();
         }
         bao = null;
         if (bsi != null) {
            bsi.close();
         }
         bsi = null;
      }
   }

   public static byte[] fileToBytes(File fp) throws IOException {
      ByteArrayOutputStream bao = null;
      byte[] buffer = new byte[8192];
      int numOfBytes = -1;
      BufferedInputStream bsi = null;
      try {
         bao = new ByteArrayOutputStream();
         bsi = new BufferedInputStream(new FileInputStream(fp));
         while ((numOfBytes = bsi.read(buffer, 0, buffer.length)) != -1) {
            bao.write(buffer, 0, numOfBytes);
         }
         return bao.toByteArray();
      } catch (Exception ex) {
         return new byte[0];
      } finally {
         if (bao != null) {
            bao.close();
         }
         bao = null;
         if (bsi != null) {
            bsi.close();
         }
         bsi = null;
      }
   }
   
   public static String fileToString(File fp) throws IOException {
      return fileToString(fp, Charset.forName("UTF-8"));
   }
   
   public static String fileToString(File fp, Charset charset) throws IOException {
      ByteArrayOutputStream bao = null;
      byte[] buffer = new byte[8192];
      int numOfBytes = -1;
      BufferedInputStream bsi = null;
      try {
         bao = new ByteArrayOutputStream();
         bsi = new BufferedInputStream(new FileInputStream(fp));
         while ((numOfBytes = bsi.read(buffer, 0, buffer.length)) != -1) {
            bao.write(buffer, 0, numOfBytes);
         }
         return new String(bao.toByteArray(), charset);
      } catch (Exception ex) {
         return "";
      } finally {
         if (bao != null) {
            bao.close();
         }
         bao = null;
         if (bsi != null) {
            bsi.close();
         }
         bsi = null;
      }
   }

   public static void saveBytesToFile(String path, byte[] bytes) {
      if (path == null) {
         return;
      }
      BufferedOutputStream bos = null;
      try {
         bos = new BufferedOutputStream(new FileOutputStream(path));
         bos.write(bytes);
         bos.flush();
         bos.close();
      }
      catch (Exception e) {
         bos = null;
      }
      finally {
         bos = null;
      }
   }

   public static void saveStreamToFile(String path, InputStream in) throws IOException {
      if (in == null) {
         return;
      }
      BufferedOutputStream bos = null;
      BufferedInputStream inBuffer = null;
      try {
         bos = new BufferedOutputStream(new FileOutputStream(path));
         inBuffer = new BufferedInputStream(in);
         int numofbytes = 0;
         byte[] buffer = new byte[8192];
         while ((numofbytes = inBuffer.read(buffer, 0, buffer.length)) > -1) {
            bos.write(buffer, 0, numofbytes);
         }
         bos.flush();
      } finally {
         if (bos != null) {
            try {
               bos.close();
            } catch (Exception ex) {
               bos = null;
            } finally {
               bos = null;
            }
         }
         if (inBuffer != null) {
            try {
               inBuffer.close();
            } catch (Exception ex) {
               inBuffer = null;
            } finally {
               inBuffer = null;
            }
         }
      }


   }

   public static void closeStream(InputStream pIn) {
      InputStream in = pIn;
      try {
         if (in != null) {
            in.close();
         }
      } catch (Exception ex) {
         in = null;
      } finally {
         in = null;
      }
   }

   public static void closeStream(OutputStream pOut) {
      OutputStream out = pOut;
      try {
         if (out != null) {
            out.flush();
         }
         if (out != null) {
            out.close();
         }
      } catch (Exception ex) {
         out = null;
      } finally {
         out = null;
      }
      
   }

   public static void closeStream(Reader pIn) {
      Reader in = pIn;
      try {
         if (in != null) {
            in.close();
         }
      } catch (Exception ex) {
         in = null;
      } finally {         
         in = null;
      }
   }

   public static void closeStream(Writer pOut) {
      Writer out = pOut;
      try {
         if (out != null) {
            out.flush();
         }
         if (out != null) {
            out.close();
         }
      } catch (Exception ex) {
         out = null;
      } finally {
         out = null;
      }
   }

   public static String convertPathToUnixFormat(String pPath) {
      if (pPath == null) {
         return "";
      }
      String path = pPath;
      path = path.trim();
      path = path.replaceAll("\\\\", "/");
      path = path.replaceAll("(/)+", "/");
      return path;
   }
}