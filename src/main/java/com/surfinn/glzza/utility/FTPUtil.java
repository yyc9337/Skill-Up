package com.surfinn.glzza.utility;

import org.apache.commons.net.PrintCommandListener;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

import java.io.*;

public class FTPUtil {
	FTPClient ftp = null;
    
    //param( host server ip, username, password )
    public FTPUtil(String host, int port, String user, String pwd) throws IOException{
        ftp = new FTPClient();
        ftp.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out)));
        int reply;
        ftp.connect(host, port);//호스트 연결
        reply = ftp.getReplyCode();
        if (!FTPReply.isPositiveCompletion(reply)) {
            ftp.disconnect();
            throw new IOException("Exception in connecting to FTP Server");
        }
        ftp.login(user, pwd);//로그인
        ftp.setFileType(FTP.BINARY_FILE_TYPE);
        //ftp.enterRemoteActiveMode(host, port);
        //ftp.enterRemotePassiveMode();
        ftp.enterLocalPassiveMode();
    }
    //param( 보낼파일경로+파일명, 호스트에서 받을 파일 이름, 호스트 디렉토리 )
    public void uploadFile(String localFileFullName, String fileName, String hostDir) throws IOException {
        try(InputStream input = new FileInputStream(new File(localFileFullName))){
        	this.ftp.storeFile(hostDir + fileName, input);
        }
    }
 
    public void disconnect(){
        if (this.ftp.isConnected()) {
            try {
                this.ftp.logout();
                this.ftp.disconnect();
            } catch (IOException f) {
                f.printStackTrace();
            }
        }
    }
}
