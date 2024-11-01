package be.ucll.mobile.rngenius.auth.model.request;

public class RefreshReq {
    public String refreshToken;
    public String accessToken;

    public RefreshReq(String refreshToken, String accessToken) {
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }
}
