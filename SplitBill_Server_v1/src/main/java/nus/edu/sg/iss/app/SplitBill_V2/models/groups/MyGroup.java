package nus.edu.sg.iss.app.SplitBill_V2.models.groups;

public class MyGroup {

    private Integer id;
    private String groupname;    

    public MyGroup(Integer id, String groupname) {
        this.id = id;
        this.groupname = groupname;
    }    

    public MyGroup(String groupname) {
        this.groupname = groupname;
    }

    public String getGroupname() {
        return groupname;
    }

    public void setGroupname(String groupname) {
        this.groupname = groupname;
    }

    @Override
    public String toString() {
        return "MyGroup [groupname=" + groupname + "]";
    }

    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }          
}
